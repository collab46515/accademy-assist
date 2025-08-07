import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Head Teacher",
      school: "Greenwood Academy",
      content: "EduFlow Pro has transformed how we manage our school. The integrated modules save us hours every week, and the parent communication features have significantly improved engagement.",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "David Chen",
      role: "School Administrator", 
      school: "Riverside High School",
      content: "The fee management system alone has paid for itself. We've reduced billing errors by 95% and automated most of our financial processes. Exceptional value.",
      rating: 5,
      avatar: "DC"
    },
    {
      name: "Emma Thompson",
      role: "Deputy Head",
      school: "Oakville Primary",
      content: "What I love most is how everything works together. Student data flows seamlessly between modules, and the reporting capabilities give us insights we never had before.",
      rating: 5,
      avatar: "ET"
    },
    {
      name: "Michael Roberts",
      role: "IT Manager",
      school: "St. Mary's College",
      content: "Implementation was smooth, and the ongoing support is fantastic. The system is reliable, secure, and the regular updates keep adding valuable features.",
      rating: 5,
      avatar: "MR"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="text-primary border-primary/20">
            Trusted by Educators
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            What Schools Are
            <span className="text-primary block">Saying About Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of educational institutions that have transformed their 
            operations with EduFlow Pro.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-lg leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.school}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-6 bg-background rounded-lg border shadow-sm">
            <div className="flex -space-x-2">
              {["JS", "AK", "MP", "TH", "RL"].map((initials, index) => (
                <div key={index} className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center border-2 border-background">
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-semibold">Join Our Community</div>
              <div className="text-sm text-muted-foreground">Transform your school today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}