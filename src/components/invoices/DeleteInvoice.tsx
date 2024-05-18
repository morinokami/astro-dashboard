import { TrashIcon } from "@heroicons/react/24/outline";
import { actions } from "astro:actions";

export function DeleteInvoice({ id }: { id: string }) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        formData.set("id", id);

        const result = await actions.deleteInvoice(formData);
        console.log(result);

        if (result.success) {
          window.location.reload();
        }
      }}
    >
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
