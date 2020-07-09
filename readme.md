https://postgres.cz/wiki/Array_based_functions

react datatable: https://o2xp.github.io/react-datatable/?path=/story/*

retorno de dados para a rota:
app.get("/",function(req,res){
    con.query("SELECT DISTINCT category FROM gameinfo",function(err,result){
        if(err) throw err;
        res.render('home',{result:result});
    });
});

modelo de query:
CREATE OR REPLACE FUNCTION foofunc(_param1 integer
                                 , _param2 date
                                 , _ids    int[] DEFAULT '{}')
  RETURNS SETOF foobar AS -- declare return type!
$func$
BEGIN  -- required for plpgsql
   IF _ids <> '{}'::int[] THEN -- exclude empty array and NULL
      RETURN QUERY
      SELECT *
      FROM   foobar
      WHERE  f1 = _param1
      AND    f2 = _param2
      AND    id = ANY(_ids); -- "IN" is not proper syntax for arrays
   ELSE
      RETURN QUERY
      SELECT *
      FROM   foobar
      WHERE  f1 = _param1
      AND    f2 = _param2;
   END IF;
END  -- required for plpgsql
$func$  LANGUAGE plpgsql;