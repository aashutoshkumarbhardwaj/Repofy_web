class DecisionOutput {
  final String decision;
  final String reasoning;
  final double confidence;
  final List<String> alternatives;
  final Map<String, dynamic> metadata;

  DecisionOutput({
    required this.decision,
    required this.reasoning,
    required this.confidence,
    required this.alternatives,
    required this.metadata,
  });

  factory DecisionOutput.fromJson(Map<String, dynamic> json) {
    return DecisionOutput(
      decision: json['decision'] ?? '',
      reasoning: json['reasoning'] ?? '',
      confidence: json['confidence']?.toDouble() ?? 0.0,
      alternatives: List<String>.from(json['alternatives'] ?? []),
      metadata: Map<String, dynamic>.from(json['metadata'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'decision': decision,
      'reasoning': reasoning,
      'confidence': confidence,
      'alternatives': alternatives,
      'metadata': metadata,
    };
  }
}