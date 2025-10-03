import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

const Dashboard = () => {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);

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
      progress: 65,
      status: "in-progress",
    },
  ];

  const toggleDataset = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

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
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Welcome back, User!</h2>
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
              disabled={selectedDatasets.length === 0}
              asChild
            >
              <Link to="/nlp-pipeline">
                Process Selected Datasets
                <Search className="w-4 h-4 ml-2" />
              </Link>
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
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Entities Extracted</p>
              <p className="text-3xl font-bold">1,247</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Relations Found</p>
              <p className="text-3xl font-bold">892</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Knowledge Triples</p>
              <p className="text-3xl font-bold">2,139</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
