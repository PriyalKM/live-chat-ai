import { ScrollArea } from "@/components/ui/scroll-area";
import { NO_DATA_IMAGE, QUESTION_ICON } from "@/lib/images";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQAList } from "@/hooks/QA/useQAList";
import Loader from "@/components/common/Loader";
import useSearch from "@/hooks/useSearch";
import dayjs from "dayjs";
import useDebounce from "@/hooks/useDebounce";

export default function QuestionsPage() {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);
  const { qaList, isLoading } = useQAList({ search: debouncedSearch });

  if (isLoading) {
    return (
      <div className="flex-1">
        <Loader />
      </div>
    );
  }
  return (
    <ScrollArea className="flex flex-col lg:h-[calc(100vh-190px)] flex-1 bg-dark rounded-2xl p-4 sm:p-6">
      {qaList.length > 0 ? (
        <div className="space-y-6 flex-1">
          {qaList.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl px-4 py-5  space-y-3"
            >
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="size-[40px] flex items-center justify-center rounded-full bg-light">
                  <img src={QUESTION_ICON} alt="question" />
                </div>
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div>
                    <div className="font-medium sm:text-lg text-primary">
                      {question.question}
                    </div>
                    <div className="text-sm text-secondary mt-1">
                      {question.answeredBy} note : Week of{" "}
                      {dayjs(question.firstAnsweredDate).format("DD MMM YYYY")}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="border border-[#D0D0D0] max-sm:text-sm rounded-lg py-2.5 font-semibold text-primary  transition">
                          Show Old Answer
                        </TooltipTrigger>
                        <TooltipContent
                          className={
                            "text-[#3B4753]  max-w-xl py-3 px-4 bg-white shadow-sm"
                          }
                          arrowClassName="fill-white bg-white"
                          side="bottom"
                        >
                          <p className="text-base">{question.answer}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <button className="border border-[#D0D0D0] rounded-lg py-2.5 max-sm:text-sm font-semibold text-primary  transition">
                      Create New Answer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lg:h-[730px] flex items-center justify-center gap-2 h-full">
          <div className="flex justify-center">
            <img src={NO_DATA_IMAGE} alt="" />
          </div>
          <p className="text-lg text-center text-secondary/60">
            No Data Available
          </p>
        </div>
      )}
    </ScrollArea>
  );
}
