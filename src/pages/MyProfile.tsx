import { Card } from '../components/ui/Card';

const myProfile = {
  id: 1,
  username: 'Carlos Usuga',
  rol: 'viewer',
  companyname: 'C y C Droguerias',
  email: 'cycdroguerias@gmail.com',
  publicIP: 'https://drogueriasCyC.com',
  cidr: '192.168.1.0/24',
  dominio: 'https://drogueriasCyC.com',
  subdomino: 'https://drogueriasCyC.com/registros',
};

const myElements = [
  { id: 1, assets: 'https//prueba1.com' },
  { id: 2, assets: 'https//prueba2.com' },
  { id: 3, assets: 'https//prueba3.com' },
];

interface MyProfileProps {
  title: string;
}

export default function MyProfile({ title }: MyProfileProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>

      {/* Perfil */}
      <Card className="flex flex-row justify-around items-center p-6 border border-slate-700">
        {/* Izquierda */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="../../public/myprofile/userImage.png"
            alt="Foto usuario"
            loading="lazy"
            className="w-50 h-50 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-white">
              {myProfile.username}
            </p>
            <p className="text-sm text-slate-400">
              {myProfile.companyname}
            </p>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex flex-col gap-6 text-sm text-slate-300">
          {/* <p><span className="font-semibold">Rol:</span> {myProfile.rol}</p> */}
          <p><span className="font-semibold">Email:</span> {myProfile.email}</p>
          <p><span className="font-semibold">IP:</span> {myProfile.publicIP}</p>
          <p><span className="font-semibold">CIDR:</span> {myProfile.cidr}</p>
          <p><span className="font-semibold">Dominio:</span> {myProfile.dominio}</p>
          <p><span className="font-semibold">Subdominio:</span> {myProfile.subdomino}</p>
        </div>
      </Card>

      <h1 className="text-xl font-semibold text-slate-100">Mis activos</h1>
      {/* Tabla */}
      <Card className="p-6 border border-slate-700">
        <table className="w-full text-center text-sm text-slate-300">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-700">
            <tr>
              <th className="py-2 w-1/3">ID</th>
              <th className="py-2 w-2/3">Assets</th>
            </tr>
          </thead>
          <tbody>
            {myElements.map((el) => (
              <tr key={el.id} className="border-b border-slate-700">
                <td className="py-2">{el.id}</td>
                <td className="py-2">{el.assets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}