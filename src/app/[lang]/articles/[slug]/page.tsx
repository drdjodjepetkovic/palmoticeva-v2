import { ArticleView } from "@/features/content/components/articles/article-view";
import { articlesData } from "@/features/content/data/articles";

type Props = {
    params: {
        slug: string;
    };
};

export function generateStaticParams() {
    return articlesData.map((article) => ({
        slug: article.slug,
    }));
}

export default function ArticlePage({ params }: Props) {
    return <ArticleView slug={params.slug} />;
}
