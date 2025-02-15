import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { RootState } from "../store/store";
import { fetchUsers, deleteUser, useAppDispatch } from "../store/slice/userReducer";
 
const Users = () => {
  const dispatch = useAppDispatch(); 
  const users = useSelector((state: RootState) => state.user.items);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle delete confirmation
  const handleDelete = async (uid: string) => {
    try {
      await dispatch(deleteUser(uid)).unwrap(); // Dispatch deleteUser thunk
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (uid: string) => {
    setUserToDelete(uid);
    setIsDeleteDialogOpen(true);
  };

  // Filter users based on search term (firstName)
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin " />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by first name..."
          className="w-full max-w-md"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full  border border-gray-400">
          <thead>
            <tr className="">
              <th className="py-2 px-4 border-b">UID</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Premium</th>
              <th className="py-2 px-4 border-b">Balance</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-200">
                <td className="py-2 px-4 border-b">{user.uid}</td>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">
                  {user.isPremium ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="">No</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">${user.balance?.toFixed(2) || "0.00"}</td>
                <td className="py-2 px-4 border-b">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(user.uid)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  handleDelete(userToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;