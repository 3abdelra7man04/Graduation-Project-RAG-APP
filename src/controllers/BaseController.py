from helpers.config import get_settings, Settings
import os
import random
import string


class BaseController:
    # Base class for shared controller utilities
    def __init__(self):
        # Load application settings
        self.app_settings = get_settings()

        # Resolve base project directory
        self.base_dir = os.path.dirname(os.path.dirname(__file__))

        # Path to stored file assets
        self.files_dir = os.path.join(self.base_dir, "assets/files")

    def generate_random_string(self, length: int = 12):
        # Generate a random alphanumeric string
        return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))
