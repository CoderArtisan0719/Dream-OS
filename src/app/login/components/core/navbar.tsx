import { Github, BookOpen } from "lucide-react";
import { Button } from ".";

export const Navbar = ({ framework }: { framework: string }) => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-20 border-b border-gray-200 bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground">
            Capsule SDK Demo for {framework}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/capsule-org/react-integration-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://docs.usecapsule.com/"
              className="text-foreground hover:text-muted-foreground"
            >
              <BookOpen className="h-5 w-5" />
              <span className="sr-only">Documentation</span>
            </a>
          </Button>
          <Button asChild>
            <a
              href="https://usecapsule.com/beta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Access
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};
