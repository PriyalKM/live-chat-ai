import { Outlet, useLocation } from 'react-router';
import Header from './header/Header';
import Agent from '@/section/home/Agent';
import SearchField from '@/components/common/SearchField';
import { cn } from '@/lib/utils';
const MainLayout = () => {
    const { pathname } = useLocation();
    const headings = [
        { path: '/questions', heading: 'Q&As' },
        { path: '/follow_ups', heading: 'Follow-Ups' },
        { path: '/alerts', heading: 'Alerts Timeline' }
    ]
    const agentNotIncludeList = ['/home', '/'];
    const isAgentNotInclude = agentNotIncludeList.includes(pathname);

    return (
        <section className='py-4 h-screen flex lg:overflow-hidden flex-col gap-4 sm:gap-5'>
            <Header />
            <section className="flex-1 flex flex-col gap-4 sm:gap-5">
                {(pathname != '/' && pathname != "/home" && pathname != "/discuss") &&
                    <div className='bs-container-xl max-xl:px-8 max-sm:px-4 flex justify-between items-center'>
                        <h2 className='text-2xl max-sm:hidden text-primary font-bold'>{headings.find((route) => pathname.includes(route.path) || pathname.startsWith(route.path))?.heading ?? "Not Found"}</h2>
                        <SearchField />
                    </div>}
                <div className="bs-container-xl max-xl:px-8 max-sm:px-4 flex-1 max-lg:flex-col-reverse flex gap-0 sm:gap-10">
                    <Outlet />
                    {pathname != '/' && <h2 className='text-2xl sm:hidden text-primary max-sm:pb-5 max-sm:pt-6  font-bold'>{headings.find((route) => pathname.includes(route.path) || pathname.startsWith(route.path))?.heading ?? "Not Found"}</h2>}
                    <div className={cn("lg:w-[430px] flex flex-col rounded-2xl", pathname == '/' ? "max-lg:h-[80vh]" : "max-lg:h-[71vh] ")}>
                        <Agent isAgentNotInclude={isAgentNotInclude}/>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default MainLayout;
