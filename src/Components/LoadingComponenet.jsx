import { useEffect } from "react";
/**
 * Show Loading component.
 * @param {boolean} loading - set loading = {boolean} and set description={text} to show when component is visible.
 */
export function LoadingComponenet(props) {
  useEffect(() => {}, []);
  return (
    <>
      {props.loading ? (
        <div
          className="fixed z-40 bg-stone-100/75 w-full
        h-full inset-0 flex justify-center items-center"
        >
          <div className=" bg-white w-1/4 rounded-lg">
            <img className="w-full" src="/loading.gif" alt="loading" />
            <div className="text-center p-2 font-bold">Pease Wait</div>
            <div className="text-primary text-center text-xl px-2 pb-8 font-bold">
              {props.description ? props.description : null}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
