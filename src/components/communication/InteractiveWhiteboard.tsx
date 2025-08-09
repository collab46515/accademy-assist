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
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text" | "eraser">("draw");
  const [brushWidth, setBrushWidth] = useState(2);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const { toast } = useToast();

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500"
  ];

  // Function to resize canvas to fit container
  const resizeCanvas = () => {
    if (!containerRef.current) return { width: 800, height: 400 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = Math.max(400, rect.width - 32); // Account for padding
    const height = Math.max(300, rect.height - 32); // Account for padding
    
    console.log('Canvas resize:', { width, height, containerRect: rect });
    return { width, height };
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    console.log('Initializing whiteboard canvas...');
    
    // Calculate proper canvas size
    const { width, height } = resizeCanvas();
    setCanvasSize({ width, height });

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
      isDrawingMode: false,
    });

    console.log('Canvas created with dimensions:', { width, height });

    // Initialize canvas properly
    const initializeCanvas = () => {
      try {
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = activeColor;
          canvas.freeDrawingBrush.width = brushWidth;
          canvas.isDrawingMode = activeTool === "draw";
          console.log('Whiteboard: Canvas fully initialized');
          
          toast({
            title: "Whiteboard ready!",
            description: "Start drawing and collaborating",
          });
        } else {
          console.warn('freeDrawingBrush not ready, retrying...');
          setTimeout(initializeCanvas, 50);
        }
      } catch (error) {
        console.error('Error initializing canvas:', error);
        setTimeout(initializeCanvas, 100);
      }
    };

    // Start initialization
    setTimeout(initializeCanvas, 100);
    setFabricCanvas(canvas);

    // Set up real-time collaboration
    canvas.on('path:created', (e) => {
      if (!isReadOnly) {
        console.log('Path created:', e);
      }
    });

    canvas.on('object:added', () => {
      console.log('Object added to canvas');
    });

    // Handle window resize
    const handleResize = () => {
      const newSize = resizeCanvas();
      if (newSize.width !== canvas.width || newSize.height !== canvas.height) {
        canvas.setDimensions(newSize);
        canvas.renderAll();
        setCanvasSize(newSize);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw" || activeTool === "eraser";
    
    // Add null check for freeDrawingBrush before accessing it
    if (fabricCanvas.freeDrawingBrush) {
      if (activeTool === "draw") {
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = brushWidth;
      } else if (activeTool === "eraser") {
        fabricCanvas.freeDrawingBrush.color = "#ffffff";
        fabricCanvas.freeDrawingBrush.width = brushWidth * 2;
      }
    } else {
      console.warn('freeDrawingBrush not available for tool:', activeTool);
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
      multiplier: 1,
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
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <div className="flex gap-1">
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("select")}
          disabled={isReadOnly}
          className="h-8 px-2 text-xs"
        >
          Select
        </Button>
        <Button
          variant={activeTool === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("draw")}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <PenTool className="h-3 w-3" />
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("eraser")}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <Eraser className="h-3 w-3" />
        </Button>
        <Button
          variant={activeTool === "rectangle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("rectangle")}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant={activeTool === "circle" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("circle")}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <CircleIcon className="h-3 w-3" />
        </Button>
        <Button
          variant={activeTool === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => handleToolClick("text")}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <Type className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <span className="text-xs">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushWidth}
          onChange={(e) => setBrushWidth(Number(e.target.value))}
          disabled={isReadOnly}
          className="w-16 h-4"
        />
        <span className="text-xs w-6">{brushWidth}</span>
      </div>
      
      <div className="flex gap-1 ml-2">
        {colors.map((color) => (
          <Button
            key={color}
            variant={activeColor === color ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveColor(color)}
            disabled={isReadOnly}
            className="w-6 h-6 p-0 border"
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
          className="h-8 px-2"
        >
          <Undo2 className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          disabled={isReadOnly}
          className="h-8 px-2"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="h-8 px-2"
        >
          <Download className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4" />
          <span className="font-medium text-sm">Interactive Whiteboard</span>
          {isReadOnly && (
            <span className="text-xs bg-muted px-2 py-1 rounded">View Only</span>
          )}
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="px-4 py-2 bg-muted/20 border-b flex-shrink-0">
        <Toolbar />
      </div>
      
      {/* Canvas Area - Takes remaining height */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <div 
          ref={containerRef}
          className="absolute inset-0"
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
            style={{ 
              display: 'block'
            }}
          />
          {!fabricCanvas && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading whiteboard...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}