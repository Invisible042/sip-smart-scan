import os
from typing import Optional
import io

# Conditional import for Google Cloud Vision
try:
    from google.cloud import vision
    VISION_AVAILABLE = True
except ImportError:
    VISION_AVAILABLE = False
    vision = None

class VisionService:
    def __init__(self):
        self.client = None
        self._setup_client()
        
        # Fallback drink dictionary for when vision API fails
        self.fallback_drinks = [
            "Orange Juice", "Apple Juice", "Coca Cola", "Pepsi", "Water", 
            "Coffee", "Tea", "Energy Drink", "Sports Drink", "Beer"
        ]
    
    def _setup_client(self):
        """Initialize Google Cloud Vision client"""
        try:
            # Check if Vision API is available and credentials exist
            if VISION_AVAILABLE and (os.getenv('GOOGLE_APPLICATION_CREDENTIALS') or os.getenv('GOOGLE_CLOUD_PROJECT')):
                self.client = vision.ImageAnnotatorClient()
        except Exception as e:
            print(f"Vision API setup failed: {e}")
            self.client = None
    
    async def identify_drink(self, image_data: bytes) -> str:
        """
        Identify drink from image using Google Cloud Vision API
        Falls back to mock prediction if API is unavailable
        """
        if self.client:
            try:
                return await self._identify_with_vision_api(image_data)
            except Exception as e:
                print(f"Vision API failed: {e}")
                return self._fallback_prediction()
        else:
            return self._fallback_prediction()
    
    async def _identify_with_vision_api(self, image_data: bytes) -> str:
        """Use Google Cloud Vision API to identify drink"""
        image = vision.Image(content=image_data)
        
        # Detect text in the image
        text_response = self.client.text_detection(image=image)
        texts = text_response.text_annotations
        
        # Detect labels in the image
        label_response = self.client.label_detection(image=image)
        labels = label_response.label_annotations
        
        # Process text detection results
        detected_text = ""
        if texts:
            detected_text = texts[0].description.lower()
        
        # Process label detection results
        detected_labels = [label.description.lower() for label in labels]
        
        # Try to identify drink from text and labels
        drink_name = self._extract_drink_name(detected_text, detected_labels)
        
        return drink_name if drink_name else self._fallback_prediction()
    
    def _extract_drink_name(self, text: str, labels: list) -> Optional[str]:
        """Extract drink name from detected text and labels"""
        # Common drink brands and types
        drink_keywords = {
            'coca cola': 'Coca Cola',
            'coke': 'Coca Cola',
            'pepsi': 'Pepsi',
            'sprite': 'Sprite',
            'fanta': 'Fanta',
            'orange juice': 'Orange Juice',
            'apple juice': 'Apple Juice',
            'coffee': 'Coffee',
            'tea': 'Tea',
            'water': 'Water',
            'beer': 'Beer',
            'wine': 'Wine',
            'energy drink': 'Energy Drink',
            'red bull': 'Red Bull',
            'monster': 'Monster Energy',
            'sports drink': 'Sports Drink',
            'gatorade': 'Gatorade',
            'powerade': 'Powerade'
        }
        
        # Check text for drink names
        for keyword, drink_name in drink_keywords.items():
            if keyword in text:
                return drink_name
        
        # Check labels for drink-related terms
        drink_labels = ['beverage', 'drink', 'juice', 'soda', 'coffee', 'tea', 'water', 'beer', 'wine']
        for label in labels:
            if any(drink_label in label for drink_label in drink_labels):
                # Try to infer drink type from context
                if 'orange' in text or 'orange' in labels:
                    return 'Orange Juice'
                elif 'apple' in text or 'apple' in labels:
                    return 'Apple Juice'
                elif 'coffee' in label:
                    return 'Coffee'
                elif 'tea' in label:
                    return 'Tea'
        
        return None
    
    def _fallback_prediction(self) -> str:
        """Return a mock prediction when Vision API is unavailable"""
        import random
        return random.choice(self.fallback_drinks)
    
    def is_available(self) -> bool:
        """Check if Vision API is available"""
        return self.client is not None