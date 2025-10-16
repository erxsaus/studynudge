import { Route, Switch } from 'wouter';
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <Switch>
          <Route path="/" component={() => <div className="text-center"><h1 className="text-2xl font-bold">Study</h1></div>} />
          <Route path="/timer" component={() => <div className="text-center"><h1 className="text-2xl font-bold">Timer</h1></div>} />
          <Route path="/progress" component={() => <div className="text-center"><h1 className="text-2xl font-bold">Progress</h1></div>} />
          <Route path="/profile" component={() => <div className="text-center"><h1 className="text-2xl font-bold">Profile</h1></div>} />
        </Switch>
      </div>
      <BottomNav />
    </div>
  );
}
