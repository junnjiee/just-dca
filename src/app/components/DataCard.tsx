import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DataCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        
      </CardHeader>
      <CardContent>
        <div className="border-t py-2">Card Content 1</div>
        <div className="border-t py-2">Card Content 1</div>
        <div className="border-t py-2">Card Content 1</div>
        <div className="border-y py-2">Card Content 1</div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
