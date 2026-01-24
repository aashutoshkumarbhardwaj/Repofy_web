import 'package:flutter/material.dart';

class CommuteInput extends StatefulWidget {
  @override
  _CommuteInputState createState() => _CommuteInputState();
}

class _CommuteInputState extends State<CommuteInput> {
  String _selectedMethod = 'car';
  double _distance = 0.0;
  final TextEditingController _distanceController = TextEditingController();

  final List<Map<String, dynamic>> _commuteMethods = [
    {'value': 'car', 'label': 'Car', 'icon': Icons.directions_car},
    {'value': 'bus', 'label': 'Bus', 'icon': Icons.directions_bus},
    {'value': 'train', 'label': 'Train', 'icon': Icons.train},
    {'value': 'bike', 'label': 'Bike', 'icon': Icons.directions_bike},
    {'value': 'walk', 'label': 'Walk', 'icon': Icons.directions_walk},
  ];

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Commute Information',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            Text('Transportation Method:'),
            SizedBox(height: 8),
            Wrap(
              spacing: 8.0,
              children: _commuteMethods.map((method) {
                return ChoiceChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(method['icon'], size: 16),
                      SizedBox(width: 4),
                      Text(method['label']),
                    ],
                  ),
                  selected: _selectedMethod == method['value'],
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedMethod = method['value'];
                      });
                    }
                  },
                );
              }).toList(),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _distanceController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Distance (km)',
                border: OutlineInputBorder(),
                suffixText: 'km',
              ),
              onChanged: (value) {
                setState(() {
                  _distance = double.tryParse(value) ?? 0.0;
                });
              },
            ),
            SizedBox(height: 8),
            Text(
              'Estimated CO₂ impact: ${_calculateCO2Impact().toStringAsFixed(2)} kg',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }

  double _calculateCO2Impact() {
    const Map<String, double> emissions = {
      'car': 0.21,
      'bus': 0.089,
      'train': 0.041,
      'bike': 0.0,
      'walk': 0.0,
    };
    
    return (emissions[_selectedMethod] ?? 0.0) * _distance * 2; // Round trip
  }

  Map<String, dynamic> getCommuteData() {
    return {
      'method': _selectedMethod,
      'distance': _distance,
    };
  }
}