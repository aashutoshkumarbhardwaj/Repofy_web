import 'package:flutter/material.dart';
import '../widgets/analysis_progress.dart';
import '../widgets/photo_input_card.dart';
import '../widgets/commute_input.dart';

class AnalysisScreen extends StatefulWidget {
  @override
  _AnalysisScreenState createState() => _AnalysisScreenState();
}

class _AnalysisScreenState extends State<AnalysisScreen> {
  bool _isAnalyzing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Daily Analysis'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            PhotoInputCard(),
            SizedBox(height: 16),
            CommuteInput(),
            SizedBox(height: 24),
            if (_isAnalyzing) AnalysisProgress(),
            Spacer(),
            ElevatedButton(
              onPressed: _isAnalyzing ? null : _startAnalysis,
              child: Text(_isAnalyzing ? 'Analyzing...' : 'Start Analysis'),
            ),
          ],
        ),
      ),
    );
  }

  void _startAnalysis() {
    setState(() {
      _isAnalyzing = true;
    });
    // TODO: Implement analysis logic
  }
}