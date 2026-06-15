import { TamagotchiShell } from "@/components/tamagotchi-shell"
import { PageBackground } from "@/components/page-background"

export default function Page() {
  return (
    <main className="min-h-screen relative z-0">
      <PageBackground />
      <TamagotchiShell />
    </main>
  )
}
