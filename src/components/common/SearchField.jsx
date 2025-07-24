import { cn } from "@/lib/utils";
import { SEARCH_ICON } from "@/lib/images";
import { Input } from "../ui/input";
import useSearch from "@/hooks/useSearch";
import { useLocation } from "react-router";
import { useEffect } from "react";

const SearchField = ({ className = "", inputClassName = "" }) => {
  const { pathname } = useLocation();
  const { search, setSearch } = useSearch();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  return (
    <div
      className={cn(
        "h-[48px] rounded-[8px] sm:max-w-[350px] w-full gap-2.5 flex items-center bg-light px-5",
        className
      )}
    >
      <img className="w-5" src={SEARCH_ICON} alt="" />
      <Input
        placeholder="Search"
        className={cn(
          "placeholder:text-secondary focus-visible:ring-offset-0 focus-visible:ring-0 ring-0  text-base px-0 flex-1 placeholder:font-normal border-0 shadow-none h-full md:text-base text-primary font-medium bg-fill",
          inputClassName
        )}
        value={search}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchField;
