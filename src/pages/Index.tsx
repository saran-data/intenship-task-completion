import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Network, Database, Sparkles, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-8 animate-float">
            <div className="p-6 rounded-3xl gradient-hero shadow-glow">
              <Brain className="w-20 h-20 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                KnowMap
              </span>
            </h1>
            <h2 className="text-3xl font-semibold text-foreground/90">
              Cross-Domain Knowledge Mapping Using AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Build dynamic knowledge graphs from diverse text sources. Extract entities, discover relationships, and explore semantic connections across multiple domains.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="gradient-primary text-white text-lg px-8 py-6 shadow-elegant" asChild>
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl bg-card shadow-elegant space-y-4 hover:shadow-glow transition-smooth">
            <div className="p-3 rounded-xl bg-primary/10 w-fit">
              <Network className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Entity Recognition</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced NLP models extract named entities from text, identifying people, places, organizations, and concepts with high accuracy.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card shadow-elegant space-y-4 hover:shadow-glow transition-smooth">
            <div className="p-3 rounded-xl bg-secondary/10 w-fit">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-semibold">Relation Extraction</h3>
            <p className="text-muted-foreground leading-relaxed">
              BERT-based models discover semantic relationships between entities, building a rich network of interconnected knowledge.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card shadow-elegant space-y-4 hover:shadow-glow transition-smooth">
            <div className="p-3 rounded-xl bg-primary/10 w-fit">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">Knowledge Graphs</h3>
            <p className="text-muted-foreground leading-relaxed">
              Store and visualize knowledge as interactive graphs, enabling exploration of cross-domain connections and hidden insights.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center space-y-6">
          <p className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
            Powered by Advanced AI Technology
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <span className="px-4 py-2 rounded-lg bg-card border">spaCy NER</span>
            <span className="px-4 py-2 rounded-lg bg-card border">Hugging Face Transformers</span>
            <span className="px-4 py-2 rounded-lg bg-card border">BERT Models</span>
            <span className="px-4 py-2 rounded-lg bg-card border">Graph Databases</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
