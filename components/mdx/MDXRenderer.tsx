import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getMDXComponents } from "./MDXComponents";

interface MDXRendererProps {
  source: string;
}

const remarkPlugins = [remarkGfm] as never[];
const rehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  rehypeHighlight,
];

export function MDXRenderer({ source }: MDXRendererProps) {
  const components = getMDXComponents({});
  return (
    <MDXRemote
      source={source}
      components={components as Record<string, React.ComponentType<unknown>>}
      options={{
        mdxOptions: {
          remarkPlugins,
          // vfile 版本冲突导致类型不兼容，运行时正常
          rehypePlugins: rehypePlugins as never[],
        },
      }}
    />
  );
}
