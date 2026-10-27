import Monsterx3ElementPage from "./moster-element";
import { loadLatestMonsterX3Event } from "@/data/monsterx3";

export default async function MonsterX3Page() {
  const event = await loadLatestMonsterX3Event();

  return (
    <div>
      <Monsterx3ElementPage event={event} />
    </div>
  );
}
