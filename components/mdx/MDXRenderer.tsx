import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import { getMDXComponents } from "./MDXComponents";

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  const components = getMDXComponents({});
  return (
    <MDXRemote
      source={source}
      components={components as Record<string, React.ComponentType<unknown>>}
      options={{
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeHighlight] as never[],
        },
      }}
    />
  );
}
