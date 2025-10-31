import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import authApi from "../api/authApi";

function SettingsPage({ user }) {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [formData, setFormData] = useState({
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    twitter: user?.twitter || "",
    password: "",
    newPassword: "",
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSavePreferences = () => {
    toast.success("Preferences saved!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authApi.put(
        "/change-password",
        {
          password: formData.password,
          newPassword: formData.newPassword,
        },
        { withCredentials: true }
      );
      toast.success("Password updated successfully!");
      console.log(res.data);
      setFormData((prev) => ({ ...prev, password: "", newPassword: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await authApi.delete("/delete-account", { withCredentials: true });
      toast.success("Account deleted successfully.");
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
        <section className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-10 px-4">
      <Card className="w-full max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* 1️⃣ APP PREFERENCES */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              App Preferences
            </h3>

            <div className="flex items-center justify-between py-2">
              <Label className="text-zinc-300">Theme</Label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <Label className="text-zinc-300">Email Notifications</Label>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label className="text-zinc-300">Auto-save Drafts</Label>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <Button
              onClick={handleSavePreferences}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
            >
              Save Preferences
            </Button>
          </div>

          <Separator className="bg-zinc-800" />

          {/* 2️⃣ SECURITY SETTINGS */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Security</h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Current Password
                </Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-zinc-300">
                  New Password
                </Label>
                <Input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>

          <Separator className="bg-zinc-800" />

          {/* 3️⃣ SOCIAL LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Social Links
            </h3>
            <div className="space-y-3">
              <Label htmlFor="github" className="text-zinc-300">
                GitHub
              </Label>
              <Input
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="GitHub URL"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />

              <Label htmlFor="linkedin" className="text-zinc-300">
                LinkedIn
              </Label>
              <Input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />

              <Label htmlFor="twitter" className="text-zinc-300">
                Twitter
              </Label>
              <Input
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter URL"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <Button
              onClick={() => toast.success("Social links updated!")}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Save Social Links
            </Button>
          </div>

          <Separator className="bg-zinc-800" />

          {/* 4️⃣ ACCOUNT MANAGEMENT */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">
              Account Management
            </h3>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mt-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
      >
        ← Back
      </Button>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>

    <section></section>
    </>
  );
}

export default SettingsPage;
