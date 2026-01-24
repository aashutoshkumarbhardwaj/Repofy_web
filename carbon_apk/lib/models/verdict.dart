class Verdict {
  final String overallScore;
  final String summary;
  final List<String> achievements;
  final List<String> improvements;
  final Map<String, double> scores;
  final DateTime timestamp;

  Verdict({
    required this.overallScore,
    required this.summary,
    required this.achievements,
    required this.improvements,
    required this.scores,
    required this.timestamp,
  });

  factory Verdict.fromJson(Map<String, dynamic> json) {
    return Verdict(
      overallScore: json['overallScore'] ?? '',
      summary: json['summary'] ?? '',
      achievements: List<String>.from(json['achievements'] ?? []),
      improvements: List<String>.from(json['improvements'] ?? []),
      scores: Map<String, double>.from(
        (json['scores'] ?? {}).map((k, v) => MapEntry(k, v?.toDouble() ?? 0.0))
      ),
      timestamp: DateTime.parse(json['timestamp'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'overallScore': overallScore,
      'summary': summary,
      'achievements': achievements,
      'improvements': improvements,
      'scores': scores,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}