from enum import Enum


class ResponseSignal(Enum):

    # ---------------------- project validation signals ----------------------
    PROJECT_NOT_FOUND = "didn't find project"
    
    # ---------------------- file validation and upload signals ----------------------
    FILE_VALIDATED_SUCCESS = (
        "file_validate_successfully"  # File passed all validation checks
    )
    FILE_TYPE_NOT_SUPPORTED = "file_type_not_supported"  # Unsupported file type
    FILE_SIZE_EXCEEDED = "file_size_exceeded"  # File exceeds maximum allowed size
    FILE_UPLOAD_SUCCESS = "file_upload_success"  # File uploaded successfully
    FILE_UPLOAD_FAILED = "file_upload_failed"  # File upload failed

    # ---------------------- processing signals ----------------------
    PROCESSING_SUCCESS = "processing_success"
    PROCESSING_FAILED = "processing_failed"
    NO_FILES_ERROR = "not_found_files"
    FILE_ID_ERROR = "no_file_found_with_this_id"

    # ---------------------- user signals ----------------------
    EMAIL_EXISTS = "Email already exists"
    USER_REGISTER_SUCCESS = "User successfully registered"
    LOGIN_SUCCESS = "login success"
    LOGIN_FAILED = "login failed"
    PROFILE_FOUND = "profile found successfully"
    PROFILE_NOT_FOUND = "profile not found"
