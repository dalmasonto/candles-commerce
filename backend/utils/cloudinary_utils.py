import os
import uuid
from typing import Dict, Optional, Union

import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile


def upload_file_to_cloudinary(
    file: Union[InMemoryUploadedFile, TemporaryUploadedFile],
    folder: str = "uploads",
    resource_type: str = "auto",
    public_id: Optional[str] = None,
    transformation: Optional[Dict] = None,
    **options
) -> Dict:
    """
    Upload a file to Cloudinary
    
    Args:
        file: The file to upload (from request.FILES)
        folder: The folder in Cloudinary to upload to
        resource_type: The type of resource (auto, image, video, raw)
        public_id: Optional custom public ID for the file
        transformation: Optional transformations to apply
        **options: Additional options to pass to cloudinary.uploader.upload
        
    Returns:
        Dict: The Cloudinary upload response containing URLs and metadata
    """
    # Generate a unique ID if not provided
    if not public_id:
        filename = os.path.splitext(file.name)[0]
        # Create a URL-friendly name
        safe_filename = "".join([c if c.isalnum() else "_" for c in filename])
        public_id = f"{safe_filename}_{uuid.uuid4().hex[:8]}"
    
    # Set up default options
    upload_options = {
        "folder": folder,
        "public_id": public_id,
        "resource_type": resource_type,
        "overwrite": True,
    }
    
    # Add transformations if provided
    if transformation:
        upload_options["transformation"] = transformation
        
    # Add any additional options
    upload_options.update(options)
    
    # Perform the upload
    result = cloudinary.uploader.upload(file, **upload_options)
    
    return result


def delete_file_from_cloudinary(public_id: str, resource_type: str = "image") -> Dict:
    """
    Delete a file from Cloudinary
    
    Args:
        public_id: The public ID of the file to delete
        resource_type: The type of resource (image, video, raw)
        
    Returns:
        Dict: The Cloudinary deletion response
    """
    result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    return result


def get_cloudinary_url(public_id: str, **options) -> str:
    """
    Get the URL for a Cloudinary resource
    
    Args:
        public_id: The public ID of the file
        **options: Additional options for the URL
        
    Returns:
        str: The Cloudinary URL
    """
    return cloudinary.CloudinaryImage(public_id).build_url(**options)
