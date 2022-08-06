import { getAllProducts, ProductProps } from '../services/api/requests'

const EXTERNAL_DATA_URL = 'https://medicaap.com'

function generateSiteMap(posts: ProductProps[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/about-us</loc>
     </url>
     ${posts
         .map(({ id }) => {
             return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/products/${id}`}</loc>
       </url>
     `
         })
         .join('')}
   </urlset>
 `
}

function SiteMap(): void {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps = async ({
    res,
}: {
    res: {
        setHeader: (key: string, value: string) => void
        write: (sitemap: string) => void
        end: () => void
    }
}): Promise<{ props: unknown }> => {
    const posts: ProductProps[] = await getAllProducts()
    const sitemap = generateSiteMap(posts)
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
    return {
        props: {},
    }
}

export default SiteMap
