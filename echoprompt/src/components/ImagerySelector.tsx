import { useSession } from "../contexts/SessionContext";
import { imageryOptions } from "../utils/imageryPool";

export function ImagerySelector() {
  const { selectImagery } = useSession();

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl tracking-tight text-gray-900 dark:text-gray-100">
          EchoPrompt
        </h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          选择一个意象，开启你的旅程
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {imageryOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => selectImagery(option.id)}
            className="group rounded-2xl border border-gray-200 bg-white/60 p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/20 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-amber-600 dark:hover:shadow-amber-900/20"
          >
            <h3 className="mb-1.5 font-serif text-xl text-gray-800 dark:text-gray-200">
              {option.label}
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {option.atmosphere.slice(0, 60)}…
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
