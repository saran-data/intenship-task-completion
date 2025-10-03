import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  ArrowLeft,
  Play,
  CheckCircle2,
  Network,
  Database,
} from "lucide-react";

const NLPPipeline = () => {
  const [text, setText] = useState(
    "Albert Einstein developed the theory of relativity while working at the patent office in Bern. His groundbreaking work revolutionized physics and earned him the Nobel Prize in 1921."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const entities = [
    { text: "Albert Einstein", type: "PERSON", color: "bg-blue-100 text-blue-700" },
    { text: "theory of relativity", type: "WORK", color: "bg-purple-100 text-purple-700" },
    { text: "patent office", type: "ORG", color: "bg-green-100 text-green-700" },
    { text: "Bern", type: "LOCATION", color: "bg-orange-100 text-orange-700" },
    { text: "Nobel Prize", type: "AWARD", color: "bg-pink-100 text-pink-700" },
    { text: "1921", type: "DATE", color: "bg-yellow-100 text-yellow-700" },
  ];

  const relations = [
    {
      subject: "Albert Einstein",
      predicate: "developed",
      object: "theory of relativity",
    },
    {
      subject: "Albert Einstein",
      predicate: "worked at",
      object: "patent office",
    },
    {
      subject: "patent office",
      predicate: "located in",
      object: "Bern",
    },
    {
      subject: "Albert Einstein",
      predicate: "received",
      object: "Nobel Prize",
    },
  ];

  const processingSteps = [
    { name: "Text Preprocessing", progress: 100 },
    { name: "Named Entity Recognition", progress: 100 },
    { name: "Relation Extraction", progress: 100 },
    { name: "Triple Formation", progress: 80 },
    { name: "Graph Database Storage", progress: 60 },
  ];

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">NLP Pipeline</h1>
                  <p className="text-xs text-muted-foreground">
                    Entity & Relation Extraction
                  </p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="text-sm">
              Milestone 2
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Text Input */}
        <Card className="p-6 shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Text Input</h2>
              <Button
                onClick={handleProcess}
                className="gradient-primary text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Process Text
                  </>
                )}
              </Button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for entity and relation extraction..."
              className="min-h-[120px] text-base"
            />
          </div>
        </Card>

        {/* Processing Pipeline Status */}
        <Card className="p-6 shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Processing Pipeline</h3>
            </div>

            <div className="space-y-3">
              {processingSteps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {step.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted" />
                      )}
                      <span className={step.progress === 100 ? "font-medium" : ""}>
                        {step.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{step.progress}%</span>
                  </div>
                  <Progress value={step.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Named Entity Recognition */}
          <Card className="p-6 shadow-elegant">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Named Entity Recognition</h3>
                <Badge variant="secondary">{entities.length} entities</Badge>
              </div>

              <div className="space-y-3">
                {entities.map((entity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="font-medium">{entity.text}</span>
                    <Badge className={entity.color}>{entity.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Relation Extraction */}
          <Card className="p-6 shadow-elegant">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relation Extraction</h3>
                <Badge variant="secondary">{relations.length} relations</Badge>
              </div>

              <div className="space-y-3">
                {relations.map((relation, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-primary">
                        {relation.subject}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                        {relation.predicate}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold text-secondary">
                        {relation.object}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Knowledge Graph Storage */}
        <Card className="p-6 shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Knowledge Graph Storage</h3>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border-2 border-dashed">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Triples Ready for Storage</p>
                <p className="text-3xl font-bold text-primary">{relations.length}</p>
                <p className="text-xs text-muted-foreground">
                  Formatted as (Entity1 - Relation - Entity2)
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="gap-2">
                <Database className="w-4 h-4" />
                Export to Graph Database
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default NLPPipeline;
