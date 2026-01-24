import 'package:flutter/material.dart';
import '../models/verdict.dart';

class VerdictCard extends StatelessWidget {
  final Verdict? verdict;

  const VerdictCard({Key? key, this.verdict}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (verdict == null) {
      return _buildEmptyState(context);
    }

    return Card(
      elevation: 4,
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Daily Verdict',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getScoreColor(verdict!.overallScore),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    verdict!.overallScore,
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              verdict!.summary,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            SizedBox(height: 16),
            _buildScoreBreakdown(context),
            SizedBox(height: 16),
            if (verdict!.achievements.isNotEmpty) ...[
              _buildSection(
                context,
                'Achievements',
                verdict!.achievements,
                Icons.star,
                Colors.amber,
              ),
              SizedBox(height: 12),
            ],
            if (verdict!.improvements.isNotEmpty) ...[
              _buildSection(
                context,
                'Areas for Improvement',
                verdict!.improvements,
                Icons.trending_up,
                Colors.blue,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(Icons.assessment, size: 48, color: Colors.grey),
            SizedBox(height: 8),
            Text(
              'No verdict available',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            SizedBox(height: 4),
            Text(
              'Complete your daily analysis to see your verdict',
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreBreakdown(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Score Breakdown',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        SizedBox(height: 8),
        ...verdict!.scores.entries.map((entry) {
          return Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Text(
                    entry.key.toUpperCase(),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ),
                Expanded(
                  flex: 3,
                  child: LinearProgressIndicator(
                    value: entry.value / 100,
                    backgroundColor: Colors.grey.shade300,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getProgressColor(entry.value),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  '${entry.value.toInt()}%',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildSection(
    BuildContext context,
    String title,
    List<String> items,
    IconData icon,
    Color color,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 20),
            SizedBox(width: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ],
        ),
        SizedBox(height: 8),
        ...items.map((item) {
          return Padding(
            padding: EdgeInsets.only(bottom: 4, left: 28),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('• ', style: TextStyle(color: color)),
                Expanded(child: Text(item)),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }

  Color _getScoreColor(String score) {
    switch (score) {
      case 'A+':
      case 'A':
        return Colors.green;
      case 'B+':
      case 'B':
        return Colors.lightGreen;
      case 'C+':
      case 'C':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  Color _getProgressColor(double value) {
    if (value >= 85) return Colors.green;
    if (value >= 75) return Colors.lightGreen;
    if (value >= 65) return Colors.orange;
    return Colors.red;
  }
}