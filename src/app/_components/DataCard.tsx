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
        <div className="border-t py-2">Profit/Loss</div>
        <div className="border-t py-2">Investment Value</div>
        <div className="border-t py-2">Contribution</div>
        <div className="border-t py-2">Shares Bought</div>
        <div className="border-y py-2">Average Stock Price</div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
