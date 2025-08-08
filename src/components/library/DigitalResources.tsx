import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Headphones, Video, Globe, Download, Play, Eye, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DigitalResources() {
  const ebooks = [
    { 
      id: "1", 
      title: "Digital Physics", 
      author: "Dr. Smith", 
      format: "PDF", 
      size: "12.5 MB", 
      downloads: 45,
      rating: 4.8,
      readingTime: "3 hours"
    },
    { 
      id: "2", 
      title: "Modern Literature", 
      author: "Jane Doe", 
      format: "EPUB", 
      size: "8.2 MB", 
      downloads: 67,
      rating: 4.6,
      readingTime: "5 hours"
    },
    { 
      id: "3", 
      title: "Mathematics Guide", 
      author: "Prof. Wilson", 
      format: "PDF", 
      size: "15.8 MB", 
      downloads: 123,
      rating: 4.9,
      readingTime: "4 hours"
    }
  ];

  const audiobooks = [
    { 
      id: "1", 
      title: "The History of Science", 
      narrator: "John Williams", 
      duration: "6h 45m", 
      plays: 28,
      rating: 4.7
    },
    { 
      id: "2", 
      title: "English Literature Classics", 
      narrator: "Sarah Thompson", 
      duration: "8h 30m", 
      plays: 45,
      rating: 4.9
    }
  ];

  const videos = [
    { 
      id: "1", 
      title: "Chemistry Experiments", 
      duration: "45 minutes", 
      views: 156,
      subject: "Chemistry",
      level: "KS3"
    },
    { 
      id: "2", 
      title: "Historical Documentaries", 
      duration: "90 minutes", 
      views: 89,
      subject: "History",
      level: "KS4"
    }
  ];

  const onlineResources = [
    { name: "Oxford Digital Library", status: "Connected", users: 245 },
    { name: "Cambridge Online", status: "Connected", users: 189 },
    { name: "National Geographic Kids", status: "Connected", users: 312 },
    { name: "BBC Educational", status: "Connected", users: 156 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-sm text-muted-foreground">E-Books</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Headphones className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">389</p>
              <p className="text-sm text-muted-foreground">Audiobooks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Video className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">567</p>
              <p className="text-sm text-muted-foreground">Videos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Globe className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Online Platforms</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ebooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ebooks">E-Books</TabsTrigger>
          <TabsTrigger value="audiobooks">Audiobooks</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="platforms">Online Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="ebooks">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ebooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{book.format}</Badge>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>⭐ {book.rating}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {book.downloads} downloads
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {book.readingTime}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => console.log(`Read ${book.title} online`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Read Online
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => console.log(`Download ${book.title}`)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Size: {book.size}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audiobooks">
          <div className="grid gap-4 md:grid-cols-2">
            {audiobooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">Narrated by {book.narrator}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">⭐ {book.rating}</Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{book.duration}</span>
                    <span>{book.plays} plays</span>
                  </div>
                  
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => console.log(`Continue playing ${book.title}`)}>
                      <Play className="h-4 w-4 mr-1" />
                      Continue Playing
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => console.log(`Download ${book.title}`)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{video.subject}</Badge>
                      <Badge variant="outline" className="text-xs">{video.level}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                  
                  <Button size="sm" className="w-full" onClick={() => console.log(`Watch ${video.title}`)}>
                    <Play className="h-4 w-4 mr-1" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="grid gap-4 md:grid-cols-2">
            {onlineResources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{resource.name}</h3>
                    <Badge variant="default">{resource.status}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Users</span>
                      <span className="font-medium">{resource.users}</span>
                    </div>
                    <Progress value={(resource.users / 400) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1" onClick={() => console.log(`Access ${resource.name}`)}>
                      <Globe className="h-4 w-4 mr-1" />
                      Access Platform
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => console.log(`Settings for ${resource.name}`)}>Settings</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reading Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Reading Analytics</CardTitle>
          <CardDescription>Track digital resource usage and reading habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Most Popular Genre</p>
              <p className="text-2xl font-bold text-blue-600">Science Fiction</p>
              <p className="text-xs text-muted-foreground">45% of digital borrows</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Reading Time</p>
              <p className="text-2xl font-bold text-green-600">2.5 hours</p>
              <p className="text-xs text-muted-foreground">Per session</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">78%</p>
              <p className="text-xs text-muted-foreground">Books finished</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}