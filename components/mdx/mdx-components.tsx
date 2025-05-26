import { MDXComponents } from 'mdx/types'
import {
  // Typography
  H1, H2, H3, H4, H5, H6,
  MDXLink,
  Paragraph,
  
  // Lists
  UnorderedList,
  OrderedList,
  ListItem,
  
  // Text formatting
  Strong,
  Emphasis,
  InlineCode,
  Blockquote,
  HorizontalRule,
  
  // Tables
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  
  // Media and custom components
  MDXImage,
  CodeBlock,
  CodePen,
} from './elements'

export const mdxComponents: MDXComponents = {
  // Typography
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: Paragraph,
  a: MDXLink,
  
  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  
  // Text formatting
  strong: Strong,
  em: Emphasis,
  code: InlineCode,
  blockquote: Blockquote,
  hr: HorizontalRule,
  
  // Tables
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  
  // Media
  img: MDXImage,
  
  // Custom components
  CodeBlock,
  CodePen,
} 