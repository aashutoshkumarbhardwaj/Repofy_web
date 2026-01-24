class CarbonImpact {
  final double totalEmissions;
  final double foodEmissions;
  final double transportEmissions;
  final String category;
  final List<String> recommendations;

  CarbonImpact({
    required this.totalEmissions,
    required this.foodEmissions,
    required this.transportEmissions,
    required this.category,
    required this.recommendations,
  });

  factory CarbonImpact.fromJson(Map<String, dynamic> json) {
    return CarbonImpact(
      totalEmissions: json['totalEmissions']?.toDouble() ?? 0.0,
      foodEmissions: json['foodEmissions']?.toDouble() ?? 0.0,
      transportEmissions: json['transportEmissions']?.toDouble() ?? 0.0,
      category: json['category'] ?? '',
      recommendations: List<String>.from(json['recommendations'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalEmissions': totalEmissions,
      'foodEmissions': foodEmissions,
      'transportEmissions': transportEmissions,
      'category': category,
      'recommendations': recommendations,
    };
  }
}