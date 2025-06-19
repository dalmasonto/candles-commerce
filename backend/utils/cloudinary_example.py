from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .cloudinary_utils import upload_file_to_cloudinary


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    """
    Example view for uploading an image to Cloudinary
    
    Request should include a file with the key 'image'
    Optional parameters:
    - folder: Cloudinary folder to upload to (default: 'uploads')
    - public_id: Custom public ID for the file (default: auto-generated)
    """
    if 'image' not in request.FILES:
        return Response(
            {'error': 'No image file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    image_file = request.FILES['image']
    
    # Get optional parameters from request data
    folder = request.data.get('folder', 'uploads')
    public_id = request.data.get('public_id', None)
    
    try:
        # Upload the file to Cloudinary
        result = upload_file_to_cloudinary(
            file=image_file,
            folder=folder,
            public_id=public_id,
            # You can add additional options here
            # For example, to resize an image:
            # transformation={"width": 500, "height": 500, "crop": "limit"}
        )
        
        # Return the Cloudinary response with URLs
        return Response({
            'success': True,
            'message': 'File uploaded successfully',
            'data': {
                'public_id': result.get('public_id'),
                'url': result.get('secure_url'),
                'resource_type': result.get('resource_type'),
                'format': result.get('format'),
                'width': result.get('width'),
                'height': result.get('height'),
                'bytes': result.get('bytes'),
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Upload failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
