import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenTool, Eraser, Square, Circle as CircleIcon, Type, 
  Download, Upload, Trash2, Undo2, Redo2, Palette 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InteractiveWhiteboardProps {
  className?: string;
  roomId?: string;
}

export function InteractiveWhiteboard({ className, roomId }: InteractiveWhiteboardProps) {
  const { toast } = useToast();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Interactive Whiteboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" disabled>
              <PenTool className="h-4 w-4 mr-2" />
              Pen Tool
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Eraser className="h-4 w-4 mr-2" />
              Eraser
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Square className="h-4 w-4 mr-2" />
              Rectangle
            </Button>
            <Button variant="outline" size="sm" disabled>
              <CircleIcon className="h-4 w-4 mr-2" />
              Circle
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
          </div>
          
          <div 
            className="w-full h-96 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center bg-muted/10"
          >
            <div className="text-center space-y-2">
              <PenTool className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">Interactive Whiteboard</p>
              <p className="text-sm text-muted-foreground/70">
                Whiteboard functionality temporarily unavailable
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}