import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricText, Path } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenTool, Eraser, Square, Circle as CircleIcon, Type, 
  Download, Upload, Trash2, Undo2, Redo2, Palette 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InteractiveWhiteboardProps {
  roomId: string;
  isReadOnly?: boolean;
}

export function InteractiveWhiteboard({ roomId, isReadOnly = false }: InteractiveWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text" | "eraser">("draw");
  const [brushWidth, setBrushWidth] = useState(2);
  const { toast } = useToast();

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500"
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: activeTool === "draw",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushWidth;

    setFabricCanvas(canvas);
    
    toast({
      title: "Whiteboard ready!",
      description: "Start drawing and collaborating",
    });

    // Set up real-time collaboration (placeholder for now)
    canvas.on('path:created', (e) => {
      if (!isReadOnly) {
        // In a real implementation, you'd broadcast this change to other participants
        console.log('Path created:', e);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw" || activeTool === "eraser";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushWidth;
    } else if (activeTool === "eraser" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.freeDrawingBrush.width = brushWidth * 2;
    }
  }, [activeTool, activeColor, brushWidth, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    if (isReadOnly) return;
    
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 2,
        width: 100,
        height: 100,
      });
      fabricCanvas?.add(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas?.add(circle);
    } else if (tool === "text") {
      const text = new FabricText("Type here...", {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 20,
        fontFamily: "Arial",
      });
      fabricCanvas?.add(text);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas || isReadOnly) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast({
      title: "Whiteboard cleared!",
      description: "All drawings have been removed",
    });
  };

  const handleUndo = () => {
    if (!fabricCanvas || isReadOnly) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      fabricCanvas.renderAll();
    }
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
    });
    
    const link = document.createElement('a');
    link.download = `whiteboard-${roomId}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Whiteboard saved!",
      description: "Your whiteboard has been downloaded",
    });
  };

  const Toolbar = () => (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-lg">
      <div className="flex gap-1">
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("select")}
          disabled={isReadOnly}
        >
          Select
        </Button>
        <Button
          variant={activeTool === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("draw")}
          disabled={isReadOnly}
        >
          <PenTool className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("eraser")}
          disabled={isReadOnly}
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === "rectangle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("rectangle")}
          disabled={isReadOnly}
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === "circle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("circle")}
          disabled={isReadOnly}
        >
          <CircleIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={activeTool === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("text")}
          disabled={isReadOnly}
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushWidth}
          onChange={(e) => setBrushWidth(Number(e.target.value))}
          disabled={isReadOnly}
          className="w-20"
        />
        <span className="text-sm w-8">{brushWidth}</span>
      </div>
      
      <div className="flex gap-1">
        {colors.map((color) => (
          <Button
            key={color}
            variant={activeColor === color ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveColor(color)}
            disabled={isReadOnly}
            className="w-8 h-8 p-0"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      <div className="flex gap-1 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={isReadOnly}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isReadOnly}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Interactive Whiteboard
          {isReadOnly && (
            <span className="text-sm bg-muted px-2 py-1 rounded">View Only</span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        <Toolbar />
        
        <div className="flex-1 border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white">
          <canvas 
            ref={canvasRef} 
            className="max-w-full max-h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}