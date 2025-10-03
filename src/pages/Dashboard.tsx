import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Database,
  FileText,
  Newspaper,
  Upload,
  CheckCircle2,
  Circle,
  User,
  LogOut,
  Search,
  Network,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const datasets = [
    {
      id: "wikipedia",
      name: "Wikipedia Articles",
      icon: FileText,
      description: "Comprehensive encyclopedia articles",
      status: "available",
    },
    {
      id: "arxiv",
      name: "Scientific Papers (ArXiv)",
      icon: Database,
      description: "Research papers and academic publications",
      status: "available",
    },
    {
      id: "news",
      name: "News Articles",
      icon: Newspaper,
      description: "Current events and news sources",
      status: "available",
    },
    {
      id: "custom",
      name: "Custom Upload",
      icon: Upload,
      description: "Upload your own text documents",
      status: "available",
    },
  ];

  const milestones = [
    {
      id: 1,
      name: "User Authentication",
      progress: 100,
      status: "complete",
    },
    {
      id: 2,
      name: "Dataset Selection",
      progress: 100,
      status: "complete",
    },
    {
      id: 3,
      name: "Profile Management",
      progress: 85,
      status: "in-progress",
    },
    {
      id: 4,
      name: "NLP Pipeline",
      progress: 100,
      status: "complete",
    },
  ];

  const toggleDataset = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleProcessDatasets = async () => {
    if (!user) return;

    // Get the first selected dataset
    const firstDataset = selectedDatasets[0];
    
    if (firstDataset === "custom") {
      if (!customText.trim()) {
        toast.error("Please enter some text to process");
        return;
      }
      await processDataset("custom", customText);
    } else {
      const sampleTexts: { [key: string]: string } = {
        wikipedia: "Albert Einstein was a German-born theoretical physicist. He developed the theory of relativity and won the Nobel Prize in Physics in 1921. He was born in Ulm, Germany on March 14, 1879.",
        arxiv: "The Large Hadron Collider at CERN in Geneva, Switzerland is the world's largest particle accelerator. It was built by the European Organization for Nuclear Research between 1998 and 2008.",
        news: "Apple Inc. announced its latest iPhone model at an event in Cupertino, California. CEO Tim Cook presented the new features to thousands of attendees on September 12, 2023."
      };
      await processDataset(firstDataset, sampleTexts[firstDataset] || "");
    }
  };

  const processDataset = async (type: string, content: string) => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      // Create dataset
      const { data: dataset, error: datasetError } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          name: type === "custom" ? "Custom Dataset" : `${type} Dataset`,
          type: type,
          content: content,
          status: 'processing'
        })
        .select()
        .single();

      if (datasetError) throw datasetError;

      toast.success("Processing dataset with AI...");

      // Process with NLP
      const { data: nlpResult, error: nlpError } = await supabase.functions.invoke('process-nlp', {
        body: {
          text: content,
          datasetId: dataset.id
        }
      });

      if (nlpError) throw nlpError;

      toast.success("Dataset processed successfully!");
      navigate("/nlp-pipeline");
    } catch (error: any) {
      console.error("Error processing dataset:", error);
      toast.error(error.message || "Failed to process dataset");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">KnowMap</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/nlp-pipeline">
                  <Network className="w-4 h-4 mr-2" />
                  NLP Pipeline
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0]}!</h2>
          <p className="text-muted-foreground text-lg">
            Continue building your knowledge graph with AI-powered insights
          </p>
        </div>

        {/* Milestone Progress */}
        <Card className="p-6 shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Milestone Progress</h3>
              <Badge variant="secondary">Milestone 1 & 2</Badge>
            </div>

            <div className="grid gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {milestone.status === "complete" ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{milestone.name}</span>
                    </div>
                    <span className="text-muted-foreground">{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Dataset Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Select Datasets</h3>
              <p className="text-muted-foreground">
                Choose data sources for knowledge extraction
              </p>
            </div>
            <Button
              className="gradient-primary text-white"
              disabled={selectedDatasets.length === 0 || isProcessing}
              onClick={handleProcessDatasets}
            >
              {isProcessing ? "Processing..." : "Process Selected Datasets"}
              <Search className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {datasets.map((dataset) => {
              const Icon = dataset.icon;
              const isSelected = selectedDatasets.includes(dataset.id);

              return (
                <Card
                  key={dataset.id}
                  className={`p-6 cursor-pointer transition-smooth hover:shadow-elegant ${
                    isSelected ? "border-primary shadow-glow" : ""
                  }`}
                  onClick={() => toggleDataset(dataset.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isSelected ? "bg-primary text-white" : "bg-muted"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{dataset.name}</h4>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {dataset.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Custom Text Input */}
          {selectedDatasets.includes("custom") && (
            <Card className="p-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Custom Text Input</h4>
                <Textarea
                  placeholder="Enter your text here for NLP processing..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Entities Extracted</p>
              <p className="text-3xl font-bold">--</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Relations Found</p>
              <p className="text-3xl font-bold">--</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Knowledge Triples</p>
              <p className="text-3xl font-bold">--</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
