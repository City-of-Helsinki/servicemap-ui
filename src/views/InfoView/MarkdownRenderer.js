import styled from '@emotion/styled';
import { Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ markdown }) => {
  // Custom components for react-markdown
  const components = {
    h1: ({ children }) => (
      <Typography component="h3" variant="body2">
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography component="h3" variant="body2">
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography component="h4" variant="body2">
        {children}
      </Typography>
    ),
    p: ({ children }) => <StyledText variant="body2">{children}</StyledText>,
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => (
      <li>
        <Typography variant="body2">{children}</Typography>
      </li>
    ),
    a: ({ href, children }) => (
      <Link target="_blank" href={href}>
        <Typography variant="string">{children}</Typography>
      </Link>
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
};

const StyledText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

MarkdownRenderer.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default MarkdownRenderer;
