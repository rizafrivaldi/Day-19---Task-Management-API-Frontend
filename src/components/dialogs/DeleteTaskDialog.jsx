import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function DeleteTaskDialog({ open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />

        <AlertDialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            w-[90%]
            max-w-md
            -translate-x-1/2
            -translate-y-1/2
            rounded-xl
            bg-white
            p-6
            shadow-xl
        "
        >
          <AlertDialog.Title className="text-xl font-bold">
            Delete Task
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-gray-600">
            Are you sure you want to delete this task?
            <br />
            This action cannot be undone.
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel
              className="
                rounded-lg
                border
                px-4
                py-2
                hover:bg-gray-100
            "
            >
              Cancel
            </AlertDialog.Cancel>

            <AlertDialog.Action
              onClick={onConfirm}
              className="
                rounded-lg
                bg-red-500
                px-4
                py-2
                text-white
                hover:bg-red-600
            "
            >
              Delete
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
