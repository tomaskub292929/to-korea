
import subprocess

env_vars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID"
]

def remove_env_var(key):
    try:
        # Command: npx vercel env rm key production -y
        cmd = f"npx vercel env rm {key} production -y"
        print(f"Removing {key}...")
        subprocess.run(cmd, shell=True, check=True)
        print(f"✅ Removed {key}")
    except subprocess.CalledProcessError:
        print(f"⚠️ Failed to remove {key} (maybe didn't exist)")

for key in env_vars:
    remove_env_var(key)

print("🗑️ Cleanup complete.")
