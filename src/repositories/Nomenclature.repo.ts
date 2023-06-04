import dataSource from "../dataSource";
import Replacement from "../entity/Replacement";

const NomenclatureRepo = dataSource.getRepository(Replacement).extend({
  getReplacement(nomenclatureId: number) {
    const query = `
WITH 
repl as (
SELECT 
nomenclature_id,
replacement_id
FROM public.replacements
where nomenclature_id = $1
) 
SELECT 
replacement_id as id,
nomenclatures.number as part_number,
0 as available
FROM repl
left join nomenclatures on nomenclatures.id = repl.replacement_id
`;
    return this.query(query, [nomenclatureId]);
  },
});

export default NomenclatureRepo;
