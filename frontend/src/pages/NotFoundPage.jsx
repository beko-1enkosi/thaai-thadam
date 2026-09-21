import { Link } from 'react-router';
import PlaceholderPage from '../components/PlaceholderPage';

export default function NotFoundPage() {
  return <PlaceholderPage title="Page not found"><p>This page does not exist. <Link to="/">Return home</Link>.</p></PlaceholderPage>;
}
