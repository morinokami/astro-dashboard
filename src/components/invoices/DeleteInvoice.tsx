import { TrashIcon } from "@heroicons/react/24/outline";
import { actions } from "astro:actions";

export function DeleteInvoice({ id }: { id: string }) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        formData.set("id", id);

        const { error } = await actions.invoice.delete(formData);

        if (error === undefined) {
          window.location.reload();
        }
      }}
    >
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
