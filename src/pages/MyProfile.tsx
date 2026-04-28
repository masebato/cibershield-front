import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';

interface MyProfileProps {
  title: string;
}

export default function MyProfile({ title }: MyProfileProps) {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      {/* Perfil */}
      <Card className="flex flex-row justify-around items-center p-6 border border-slate-700">
        {/* Izquierda */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="/myprofile/userImage.png"
            alt="Foto usuario"
            loading="lazy"
            className="w-50 h-50 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-white">
              {user?.email.split('@')[0] ?? 'Usuario'}
            </p>
            <p className="text-sm text-slate-400">
              {user?.company_name ?? 'Empresa'}
            </p>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex flex-col gap-6 text-sm text-slate-300">
          <p><span className="font-semibold">Rol:</span> {user?.role ?? '-'}</p>
          <p><span className="font-semibold">Email:</span> {user?.email ?? '-'}</p>
          <p><span className="font-semibold">Empresa:</span> {user?.company_name ?? '-'}</p>
          <p><span className="font-semibold">Sector:</span> {user?.sector ?? '-'}</p>
        </div>
      </Card>

      <h1 className="text-xl font-semibold text-slate-100">Mis activos</h1>
      {/* Tabla */}
      <Card className="p-6 border border-slate-700">
        <table className="w-full text-center text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 w-1/4">ID</th>
              <th className="py-2 w-1/4">Tipo</th>
              <th className="py-2 w-2/4">Assets</th>
            </tr>
          </thead>
          <tbody>
            {user?.assets.map((el) => (
              <tr key={el.id} className="border-b border-slate-700">
                <td className="py-2">{el.id}</td>
                <td className="py-2 uppercase">{el.type}</td>
                <td className="py-2">{el.value}</td>
              </tr>
            ))}
            {!user?.assets.length && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-500">
                  No hay activos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}