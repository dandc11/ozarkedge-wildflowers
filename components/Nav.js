import cx from 'classNames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { React,useEffect, useState } from 'react';

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            // close the menu when the route changes if it's open
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router, isMenuOpen]);

    return (
        <nav
            className={`group/nav fixed font-display tracking-tight pt-6 bg-gradient-to-br from-oe-green-600 to-oe-green-yellow-800 text-2xl flex z-50 ${cx(
                {
                    'menu-active px-5 pt-6 w-full h-full overflow-hidden bg-white':
                        isMenuOpen,
                }
            )}`}
        >
            <button
                className={`menu-icon absolute top-5 left-5 z-10 h-6 border-none flex flex-col justify-between`}
                onClick={(e) => setIsMenuOpen(!isMenuOpen)}
                type="button"
            >
                <div className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}></div>
                <div className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}></div>
                <div className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}></div>
            </button>
            <ul
                className={`nav-links mt-16 hidden group-[.menu-active]/nav:block`}
            >
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/" className='text-white'>Home</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/about"  className="text-white">About Ozarkedge</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={menuImage.asset}
                    alt={menuImage.alt}
                /> */}
                    <Link href="/native-plants" className="text-white">Ozarkedge Native Plants</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/pollinators" className="text-white">Pollinators</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/season/spring" className="text-white">Spring</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/season/summer" className="text-white">Summer</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/season/fall" className="text-white">Fall</Link>
                </li>
                <li className={`nav-list-item pb-2 flex`}>
                    {/* <ResponsiveImage
                    className={`featured-image h-auto rounded-full bp-800:rounded-md bp-1100:px-4 bp-1100:pt-2`}
                    wrapperClasses={`season-img`}
                    placeholder="empty"
                    // slug={plant.slug.current}
                    // blurDataURL={plant.previewImage.asset.lqip}
                    // style={{
                    //     width: '100%',
                    //     height: '100%',
                    // }}
                    sizes="(max-width: 700px) 90vw, 700px"
                    image={mainImage.asset}
                    alt={mainImage.alt}
                /> */}
                    <Link href="/season/winter" className="text-white">Winter</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
