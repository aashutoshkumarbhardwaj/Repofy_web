import 'package:flutter/material.dart';
import 'dart:io';

class PhotoInputCard extends StatefulWidget {
  @override
  _PhotoInputCardState createState() => _PhotoInputCardState();
}

class _PhotoInputCardState extends State<PhotoInputCard> {
  List<String> _imagePaths = [];

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Meal Photos',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            if (_imagePaths.isEmpty)
              _buildEmptyState()
            else
              _buildImageGrid(),
            SizedBox(height: 16),
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: _addPhoto,
                  icon: Icon(Icons.camera_alt),
                  label: Text('Take Photo'),
                ),
                SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: _selectFromGallery,
                  icon: Icon(Icons.photo_library),
                  label: Text('Gallery'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      height: 120,
      width: double.infinity,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.add_photo_alternate, size: 48, color: Colors.grey),
          SizedBox(height: 8),
          Text(
            'Add photos of your meals',
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildImageGrid() {
    return Container(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _imagePaths.length,
        itemBuilder: (context, index) {
          return Container(
            width: 120,
            margin: EdgeInsets.only(right: 8),
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    width: 120,
                    height: 120,
                    color: Colors.grey.shade200,
                    child: Icon(Icons.image, size: 48, color: Colors.grey),
                  ),
                ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: GestureDetector(
                    onTap: () => _removePhoto(index),
                    child: Container(
                      padding: EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.close, size: 16, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _addPhoto() {
    // Mock adding a photo
    setState(() {
      _imagePaths.add('mock_photo_${_imagePaths.length + 1}.jpg');
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Photo added (mock)')),
    );
  }

  void _selectFromGallery() {
    // Mock selecting from gallery
    setState(() {
      _imagePaths.add('gallery_photo_${_imagePaths.length + 1}.jpg');
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Photo selected from gallery (mock)')),
    );
  }

  void _removePhoto(int index) {
    setState(() {
      _imagePaths.removeAt(index);
    });
  }

  List<String> getImagePaths() {
    return _imagePaths;
  }
}