create table votos (
  id bigint generated always as identity primary key,
  ronda int not null,
  eleccion text not null check (eleccion in ('real','ia')),
  acierto boolean not null,
  creado timestamptz default now()
);
create table partidas (
  id bigint generated always as identity primary key,
  puntaje int not null check (puntaje between 0 and 10),
  creado timestamptz default now()
);
alter table votos enable row level security;
alter table partidas enable row level security;
create policy "insertar votos" on votos for insert to anon with check (true);
create policy "insertar partidas" on partidas for insert to anon with check (true);

create or replace function estadisticas() returns json
language sql security definer set search_path = public as $$
  select json_build_object(
    'rondas', coalesce((select json_agg(r) from (
        select ronda,
               count(*) filter (where eleccion = 'real') as real,
               count(*) filter (where eleccion = 'ia') as ia,
               count(*) filter (where acierto) as aciertos,
               count(*) as total
        from votos group by ronda) r), '[]'::json),
    'partidas', (select count(*) from partidas),
    'promedio', (select round(avg(puntaje)::numeric, 1) from partidas)
  );
$$;
grant execute on function estadisticas() to anon;
