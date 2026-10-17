-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "fecha_nacimiento" DATE,
    "role" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "espacios" (
    "id_espacio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "capacidad" INTEGER NOT NULL,
    "precio_por_hora" DOUBLE PRECISION NOT NULL,
    "precio_por_dia" DOUBLE PRECISION NOT NULL,
    "precio_fin_de_semana" DOUBLE PRECISION NOT NULL DEFAULT 1.25,
    "precio_nocturno" DOUBLE PRECISION NOT NULL DEFAULT 1.15,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espacios_pkey" PRIMARY KEY ("id_espacio")
);

-- CreateTable
CREATE TABLE "facilidades" (
    "id_facilidad" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "facilidades_pkey" PRIMARY KEY ("id_facilidad")
);

-- CreateTable
CREATE TABLE "espacio_facilidad" (
    "id_espacio" TEXT NOT NULL,
    "id_facilidad" TEXT NOT NULL,

    CONSTRAINT "espacio_facilidad_pkey" PRIMARY KEY ("id_espacio","id_facilidad")
);

-- CreateTable
CREATE TABLE "imagenes" (
    "id_imagen" TEXT NOT NULL,
    "id_espacio" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_pkey" PRIMARY KEY ("id_imagen")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id_reserva" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_espacio" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "precio_total" DOUBLE PRECISION NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "facilidades_nombre_key" ON "facilidades"("nombre");

-- CreateIndex
CREATE INDEX "reservas_id_espacio_start_time_end_time_idx" ON "reservas"("id_espacio", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "reservas_start_time_end_time_idx" ON "reservas"("start_time", "end_time");

-- AddForeignKey
ALTER TABLE "espacio_facilidad" ADD CONSTRAINT "espacio_facilidad_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "espacios"("id_espacio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espacio_facilidad" ADD CONSTRAINT "espacio_facilidad_id_facilidad_fkey" FOREIGN KEY ("id_facilidad") REFERENCES "facilidades"("id_facilidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes" ADD CONSTRAINT "imagenes_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "espacios"("id_espacio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "espacios"("id_espacio") ON DELETE CASCADE ON UPDATE CASCADE;
