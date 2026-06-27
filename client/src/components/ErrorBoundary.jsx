import { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'flowbite-react';

// Catches any rendering crash in the component tree below it and shows a
// friendly fallback UI instead of a blank white screen.
//
// This exists because of a real incident: an outdated Flowbite API usage
// (Sidebar.Item instead of SidebarItem) threw "React error #130" and took
// down the ENTIRE dashboard with no visible error to the user — just a
// blank page. An ErrorBoundary at the app root means any future render
// crash, anywhere in the tree, degrades to this screen instead of nothing.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a real production app this is where you'd report to a service
    // like Sentry. For now, at least log it instead of failing silently.
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-white dark:bg-[rgb(16,23,42)] dark:text-white'>
          <h1 className='text-3xl font-bold'>Something went wrong</h1>
          <p className='text-gray-500 dark:text-gray-400 max-w-md'>
            This page hit an unexpected error. It&apos;s been logged — try
            going back to the homepage.
          </p>
          <Button gradientDuoTone='purpleToPink' onClick={this.handleReload}>
            Back to Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
