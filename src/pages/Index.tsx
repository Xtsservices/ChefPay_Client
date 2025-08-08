import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, FileText, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome to Your Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A beautiful responsive layout with header, sidebar, content area, and footer. 
          Everything is properly styled and ready for your content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage your users</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View and manage all users in your application.
            </p>
            <Button variant="secondary" className="w-full">
              View Users <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage your files</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload, organize and share your documents.
            </p>
            <Button variant="secondary" className="w-full">
              View Documents <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View your stats</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track performance and analyze your data.
            </p>
            <Button variant="secondary" className="w-full">
              View Analytics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-secondary border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Layout Features</CardTitle>
          <CardDescription>What's included in this responsive layout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">✨ Responsive Design</h4>
              <p className="text-sm text-muted-foreground">
                Fully responsive layout that works on all devices
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">🎨 Beautiful Styling</h4>
              <p className="text-sm text-muted-foreground">
                Modern design with gradients and smooth transitions
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">📱 Collapsible Sidebar</h4>
              <p className="text-sm text-muted-foreground">
                Sidebar that collapses on mobile and can be toggled
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">🔍 Search Ready</h4>
              <p className="text-sm text-muted-foreground">
                Header includes search functionality and notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
